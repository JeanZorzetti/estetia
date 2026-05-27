export interface GalleryCard {
  id: string
  label: string
  tag: string
  gradient: string
  accent: string
}

export const GALLERY_CARDS: GalleryCard[] = [
  { id: '1', label: 'Clínica Luna Estética', tag: 'Antes & Depois', gradient: 'linear-gradient(135deg, #0A1F3D 0%, #1A3A6B 100%)', accent: '#489FB5' },
  { id: '2', label: 'Dr. Ana Carvalho', tag: 'Dermatologista', gradient: 'linear-gradient(135deg, #1C0A07 0%, #3D1510 100%)', accent: '#C5A059' },
  { id: '3', label: '+340% Retorno', tag: 'Caso de sucesso', gradient: 'linear-gradient(135deg, #071A0A 0%, #0F3014 100%)', accent: '#5FB565' },
  { id: '4', label: 'Clínica Beleza Plena', tag: 'São Paulo • SP', gradient: 'linear-gradient(135deg, #1A0A2E 0%, #2D1456 100%)', accent: '#A06CD5' },
  { id: '5', label: 'Dra. Paula Medeiros', tag: 'Biomédica Esteta', gradient: 'linear-gradient(135deg, #0A1A1C 0%, #132D30 100%)', accent: '#489FB5' },
  { id: '6', label: '2.400 pacientes', tag: 'Gerenciados', gradient: 'linear-gradient(135deg, #1C1507 0%, #332208 100%)', accent: '#E3C97C' },
  { id: '7', label: 'Clínica Vitá', tag: 'Minas Gerais', gradient: 'linear-gradient(135deg, #0A0F1C 0%, #16203D 100%)', accent: '#489FB5' },
  { id: '8', label: 'Dr. Rafael Lima', tag: 'Dermatologista', gradient: 'linear-gradient(135deg, #1A0708 0%, #380E10 100%)', accent: '#C5A059' },
  { id: '9', label: 'Agendamento +60%', tag: 'Automação ativa', gradient: 'linear-gradient(135deg, #071C14 0%, #0D3524 100%)', accent: '#5FB565' },
  { id: '10', label: 'Studio Bloom', tag: 'Rio de Janeiro', gradient: 'linear-gradient(135deg, #1C0714 0%, #360D28 100%)', accent: '#D577A5' },
  { id: '11', label: 'Dra. Mariana Costa', tag: 'Nutricionista Esteta', gradient: 'linear-gradient(135deg, #0A1820 0%, #132A36 100%)', accent: '#489FB5' },
  { id: '12', label: 'ROI em 30 dias', tag: 'Comprovado', gradient: 'linear-gradient(135deg, #1C1A07 0%, #35300A 100%)', accent: '#E3C97C' },
]
