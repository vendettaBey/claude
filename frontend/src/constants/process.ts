import {
  ClipboardList,
  Code2,
  HeartHandshake,
  MessagesSquare,
  PenTool,
  Rocket,
  TestTube2,
} from 'lucide-react'
import type { ProcessStep } from '@/types'

export const processSteps: ProcessStep[] = [
  {
    id: 'tanisma',
    title: 'Tanışma ve İhtiyaç Analizi',
    description: 'İşletmenizi, hedeflerinizi ve ihtiyaç duyduğunuz sistemi konuşuruz.',
    output: 'İhtiyaç özeti',
    icon: MessagesSquare,
  },
  {
    id: 'planlama',
    title: 'Planlama',
    description:
      'Projenin kapsamını, sayfalarını, özelliklerini ve teknik altyapısını belirleriz.',
    output: 'Kapsam ve yol haritası',
    icon: ClipboardList,
  },
  {
    id: 'tasarim',
    title: 'Tasarım',
    description: 'Markanıza uygun kullanıcı deneyimi ve arayüz tasarımı hazırlanır.',
    output: 'Onaylanmış arayüz',
    icon: PenTool,
  },
  {
    id: 'gelistirme',
    title: 'Geliştirme',
    description: 'Onaylanan tasarım modern ve sürdürülebilir teknolojilerle geliştirilir.',
    output: 'Çalışan test sürümü',
    icon: Code2,
  },
  {
    id: 'test',
    title: 'Test',
    description: 'Mobil uyumluluk, performans, güvenlik ve kullanıcı senaryoları test edilir.',
    output: 'Test ve düzeltme raporu',
    icon: TestTube2,
  },
  {
    id: 'yayin',
    title: 'Yayına Alma',
    description:
      'Proje canlı ortama alınır, temel ayarlar ve gerekli yönlendirmeler tamamlanır.',
    output: 'Yayındaki proje',
    icon: Rocket,
  },
  {
    id: 'destek',
    title: 'Destek ve Geliştirme',
    description: 'İhtiyaç halinde bakım, teknik destek ve yeni özellik geliştirme hizmeti sunulur.',
    output: 'Sürekli bakım ve geliştirme',
    icon: HeartHandshake,
  },
]
