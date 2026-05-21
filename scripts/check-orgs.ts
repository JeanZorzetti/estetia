import { PrismaClient } from '@prisma/client'

const p = new PrismaClient()

async function main() {
  const orgs = await p.organization.findMany({
    select: {
      id: true,
      name: true,
      asaasCustomerId: true,
      asaasSubscriptionId: true,
      cnpj: true,
      billingActiveModules: true,
      extraUsers: true,
      extraRooms: true,
      extraProfs: true,
      billingMonthlyTotal: true,
    },
  })
  console.log(JSON.stringify(orgs, null, 2))

  const users = await p.user.findMany({
    select: { id: true, email: true, orgRole: true, organizationId: true },
  })
  console.log('USERS:', JSON.stringify(users, null, 2))
}

main().finally(() => p.$disconnect())
