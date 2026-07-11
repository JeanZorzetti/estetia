/**
 * Testes para feature gates (server-side enforcement)
 *
 * Pinam a matriz atual de PLAN_FEATURES: FREE 100 deals/2 users/1 pipeline,
 * STARTER 500/5/5, PRO 2500/15/15, BUSINESS -1 (deals) /50/50.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockDeep, mockReset } from 'vitest-mock-extended'
import type { PrismaClient } from '@prisma/client'
import {
  checkDealLimit,
  checkUserLimit,
  checkPipelineLimit,
  checkAgiQuota,
  consumeAgiQuota,
  checkAndConsumeScrapingCredits,
  LimitReachedError,
  FeatureBlockedError,
} from '../feature-gates'

// Mock do Prisma
vi.mock('../prisma', () => ({
  prisma: mockDeep<PrismaClient>(),
}))

import { prisma } from '../prisma'
const mockPrisma = prisma as any

describe('Feature Gates', () => {
  beforeEach(() => {
    mockReset(mockPrisma)
  })

  describe('checkDealLimit', () => {
    it('should allow creating deal when under FREE limit', async () => {
      mockPrisma.organization.findUnique.mockResolvedValue({
        tier: 'FREE',
        grandfatheredDealLimit: null,
        grandfatheredAt: null,
      })

      mockPrisma.deal.count.mockResolvedValue(30) // Abaixo de 100

      await expect(checkDealLimit('org_1')).resolves.not.toThrow()
    })

    it('should throw when FREE tier exceeds 100 deals', async () => {
      mockPrisma.organization.findUnique.mockResolvedValue({
        tier: 'FREE',
        grandfatheredDealLimit: null,
        grandfatheredAt: null,
      })

      mockPrisma.deal.count.mockResolvedValue(100) // No limite

      await expect(checkDealLimit('org_1')).rejects.toThrow(LimitReachedError)
      await expect(checkDealLimit('org_1')).rejects.toThrow(
        'deals limit reached: 100/100'
      )
    })

    it('should respect grandfathered deal limit', async () => {
      mockPrisma.organization.findUnique.mockResolvedValue({
        tier: 'FREE',
        grandfatheredDealLimit: 127, // Cliente antigo
        grandfatheredAt: new Date(),
      })

      mockPrisma.deal.count.mockResolvedValue(110) // Acima do tier, abaixo do grandfathered

      await expect(checkDealLimit('org_1')).resolves.not.toThrow()
    })

    it('should throw when exceeding grandfathered limit', async () => {
      mockPrisma.organization.findUnique.mockResolvedValue({
        tier: 'FREE',
        grandfatheredDealLimit: 100,
        grandfatheredAt: new Date(),
      })

      mockPrisma.deal.count.mockResolvedValue(100) // No limite

      await expect(checkDealLimit('org_1')).rejects.toThrow(LimitReachedError)
    })

    it('should enforce STARTER limit of 500 deals', async () => {
      mockPrisma.organization.findUnique.mockResolvedValue({
        tier: 'STARTER',
        grandfatheredDealLimit: null,
        grandfatheredAt: null,
      })

      mockPrisma.deal.count.mockResolvedValue(10000) // Muito acima

      await expect(checkDealLimit('org_1')).rejects.toThrow(LimitReachedError)
    })

    it('should enforce PRO limit of 2500 deals', async () => {
      mockPrisma.organization.findUnique.mockResolvedValue({
        tier: 'PRO',
        grandfatheredDealLimit: null,
        grandfatheredAt: null,
      })

      mockPrisma.deal.count.mockResolvedValue(2000) // Abaixo de 2500

      await expect(checkDealLimit('org_1')).resolves.not.toThrow()
    })

    it('should allow unlimited deals for BUSINESS tier', async () => {
      mockPrisma.organization.findUnique.mockResolvedValue({
        tier: 'BUSINESS',
        grandfatheredDealLimit: null,
        grandfatheredAt: null,
      })

      mockPrisma.deal.count.mockResolvedValue(20000)

      await expect(checkDealLimit('org_1')).resolves.not.toThrow()
    })

    it('should throw if organization not found', async () => {
      mockPrisma.organization.findUnique.mockResolvedValue(null)

      await expect(checkDealLimit('invalid_org')).rejects.toThrow(
        'Organization not found'
      )
    })
  })

  describe('checkUserLimit', () => {
    it('should throw when FREE tier reaches 2 users', async () => {
      mockPrisma.organization.findUnique.mockResolvedValue({ tier: 'FREE' })
      mockPrisma.user.count.mockResolvedValue(2)

      await expect(checkUserLimit('org_1')).rejects.toThrow(LimitReachedError)
      await expect(checkUserLimit('org_1')).rejects.toThrow('users limit reached')
    })

    it('should allow adding user to FREE tier under the limit', async () => {
      mockPrisma.organization.findUnique.mockResolvedValue({ tier: 'FREE' })
      mockPrisma.user.count.mockResolvedValue(1)

      await expect(checkUserLimit('org_1')).resolves.not.toThrow()
    })

    it('should enforce STARTER limit of 5 users', async () => {
      mockPrisma.organization.findUnique.mockResolvedValue({ tier: 'STARTER' })
      mockPrisma.user.count.mockResolvedValue(5)

      await expect(checkUserLimit('org_1')).rejects.toThrow(LimitReachedError)
    })

    it('should allow PRO tier up to 15 users', async () => {
      mockPrisma.organization.findUnique.mockResolvedValue({ tier: 'PRO' })
      mockPrisma.user.count.mockResolvedValue(10)

      await expect(checkUserLimit('org_1')).resolves.not.toThrow()
    })

    it('should enforce BUSINESS limit of 50 users', async () => {
      mockPrisma.organization.findUnique.mockResolvedValue({ tier: 'BUSINESS' })
      mockPrisma.user.count.mockResolvedValue(500)

      await expect(checkUserLimit('org_1')).rejects.toThrow(LimitReachedError)
    })
  })

  describe('checkPipelineLimit', () => {
    it('should throw when FREE tier reaches 1 pipeline', async () => {
      mockPrisma.organization.findUnique.mockResolvedValue({ tier: 'FREE' })
      mockPrisma.pipeline.count.mockResolvedValue(1)

      await expect(checkPipelineLimit('org_1')).rejects.toThrow(LimitReachedError)
    })

    it('should allow creating first pipeline for FREE', async () => {
      mockPrisma.organization.findUnique.mockResolvedValue({ tier: 'FREE' })
      mockPrisma.pipeline.count.mockResolvedValue(0)

      await expect(checkPipelineLimit('org_1')).resolves.not.toThrow()
    })

    it('should allow PRO tier up to 15 pipelines', async () => {
      mockPrisma.organization.findUnique.mockResolvedValue({ tier: 'PRO' })
      mockPrisma.pipeline.count.mockResolvedValue(10)

      await expect(checkPipelineLimit('org_1')).resolves.not.toThrow()
    })
  })

  describe('checkAgiQuota', () => {
    it('should deny FREE tier (quota 0 = sem acesso)', async () => {
      mockPrisma.organization.findUnique.mockResolvedValue({
        tier: 'FREE',
        agiQuota: null,
      })

      await expect(checkAgiQuota('org_1')).resolves.toBe(false)
    })

    it('should allow when under the monthly limit', async () => {
      mockPrisma.organization.findUnique.mockResolvedValue({
        tier: 'STARTER',
        agiQuota: {
          monthlyLimit: 200,
          usedThisMonth: 100,
          lastReset: new Date(),
        },
      })

      await expect(checkAgiQuota('org_1')).resolves.toBe(true)
    })

    it('should deny when monthly limit is used up', async () => {
      mockPrisma.organization.findUnique.mockResolvedValue({
        tier: 'STARTER',
        agiQuota: {
          monthlyLimit: 200,
          usedThisMonth: 200,
          lastReset: new Date(),
        },
      })

      await expect(checkAgiQuota('org_1')).resolves.toBe(false)
    })

    it('should create quota record on first use', async () => {
      mockPrisma.organization.findUnique.mockResolvedValue({
        tier: 'PRO',
        agiQuota: null,
      })
      mockPrisma.agiQuota.create.mockResolvedValue({})

      await expect(checkAgiQuota('org_1')).resolves.toBe(true)
      expect(mockPrisma.agiQuota.create).toHaveBeenCalled()
    })
  })

  describe('consumeAgiQuota', () => {
    it('should increment usage when quota record exists', async () => {
      mockPrisma.agiQuota.findUnique.mockResolvedValue({
        organizationId: 'org_1',
        monthlyLimit: 200,
        usedThisMonth: 10,
        lastReset: new Date(),
      })
      mockPrisma.agiQuota.update.mockResolvedValue({})

      await expect(consumeAgiQuota('org_1')).resolves.not.toThrow()
      expect(mockPrisma.agiQuota.update).toHaveBeenCalledWith({
        where: { organizationId: 'org_1' },
        data: { usedThisMonth: { increment: 1 } },
      })
    })

    it('should create quota record with usage 1 when missing', async () => {
      mockPrisma.agiQuota.findUnique.mockResolvedValue(null)
      mockPrisma.organization.findUnique.mockResolvedValue({ tier: 'STARTER' })
      mockPrisma.agiQuota.create.mockResolvedValue({})

      await expect(consumeAgiQuota('org_1')).resolves.not.toThrow()
      expect(mockPrisma.agiQuota.create).toHaveBeenCalled()
    })

    it('should throw if quota missing and organization not found', async () => {
      mockPrisma.agiQuota.findUnique.mockResolvedValue(null)
      mockPrisma.organization.findUnique.mockResolvedValue(null)

      await expect(consumeAgiQuota('org_1')).rejects.toThrow(
        'Organization not found'
      )
    })
  })

  describe('checkAndConsumeScrapingCredits', () => {
    it('should consume credits when balance is sufficient', async () => {
      mockPrisma.scrapingCredit.findUnique.mockResolvedValue({
        organizationId: 'org_1',
        balance: 10,
        monthlyQuota: 75,
        usedThisMonth: 65,
        lastRefill: new Date(),
      })
      mockPrisma.scrapingCredit.update.mockResolvedValue({})

      await expect(
        checkAndConsumeScrapingCredits('org_1', 5)
      ).resolves.not.toThrow()
      expect(mockPrisma.scrapingCredit.update).toHaveBeenCalledWith({
        where: { organizationId: 'org_1' },
        data: {
          balance: { decrement: 5 },
          usedThisMonth: { increment: 5 },
        },
      })
    })

    it('should throw LimitReachedError when balance is insufficient', async () => {
      mockPrisma.scrapingCredit.findUnique.mockResolvedValue({
        organizationId: 'org_1',
        balance: 5,
        monthlyQuota: 75,
        usedThisMonth: 70,
        lastRefill: new Date(),
      })

      await expect(
        checkAndConsumeScrapingCredits('org_1', 10)
      ).rejects.toThrow(LimitReachedError)
      expect(mockPrisma.scrapingCredit.update).not.toHaveBeenCalled()
    })

    it('should throw if credit record not found', async () => {
      mockPrisma.scrapingCredit.findUnique.mockResolvedValue(null)

      await expect(checkAndConsumeScrapingCredits('org_1', 1)).rejects.toThrow(
        'Scraping credits not found'
      )
    })
  })

  describe('Custom Error Types', () => {
    it('should create LimitReachedError correctly', () => {
      const error = new LimitReachedError('deals', 100, 100)
      expect(error.name).toBe('LimitReachedError')
      expect(error.message).toBe('deals limit reached: 100/100')
      expect(error.resource).toBe('deals')
      expect(error.limit).toBe(100)
      expect(error.current).toBe(100)
    })

    it('should create FeatureBlockedError correctly', () => {
      const error = new FeatureBlockedError('round_robin', 'PRO', 'BUSINESS')
      expect(error.name).toBe('FeatureBlockedError')
      expect(error.message).toBe(
        "Feature 'round_robin' requires BUSINESS plan (you are on PRO)"
      )
      expect(error.feature).toBe('round_robin')
      expect(error.currentTier).toBe('PRO')
      expect(error.requiredTier).toBe('BUSINESS')
    })
  })
})
