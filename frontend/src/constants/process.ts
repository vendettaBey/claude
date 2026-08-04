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
    description: 'Hedefi, kullanıcıyı ve çözülmesi gereken sorunu netleştiririz.',
    output: 'İhtiyaç özeti',
    icon: MessagesSquare,
  },
  {
    id: 'planlama',
    title: 'Planlama',
    description: 'Kapsamı, öncelikleri, takvimi ve teknik yaklaşımı belirleriz.',
    output: 'Kapsam ve yol haritası',
    icon: ClipboardList,
  },
  {
    id: 'tasarim',
    title: 'Tasarım',
    description: 'Kullanıcı akışlarını ve onaylayacağınız arayüzleri hazırlarız.',
    output: 'Onaylanmış arayüz',
    icon: PenTool,
  },
  {
    id: 'gelistirme',
    title: 'Geliştirme',
    description: 'Onaylanan ekranları çalışan ve yönetilebilir sisteme dönüştürürüz.',
    output: 'Çalışan test sürümü',
    icon: Code2,
  },
  {
    id: 'test',
    title: 'Test',
    description: 'Mobil uyumluluk, hız, güvenlik ve kritik kullanıcı akışlarını sınarız.',
    output: 'Test ve düzeltme raporu',
    icon: TestTube2,
  },
  {
    id: 'yayin',
    title: 'Yayına Alma',
    description: 'Sistemi canlıya alır, gerekli ayarları ve yönlendirmeleri tamamlarız.',
    output: 'Yayındaki proje',
    icon: Rocket,
  },
  {
    id: 'destek',
    title: 'Destek ve Geliştirme',
    description: 'Bakım, teknik destek ve yeni özelliklerle sistemi geliştirmeyi sürdürürüz.',
    output: 'Sürekli bakım ve geliştirme',
    icon: HeartHandshake,
  },
]
