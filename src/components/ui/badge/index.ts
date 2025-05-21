import { type VariantProps, cva } from 'class-variance-authority'

export { default as Badge } from './Badge.vue'

import { BadgeVariant } from '@/constants/ui/badge-variants.interface'
import { CobrancaStatusVariant } from '@/constants/ui/cobranca-status-variant.interface'

export const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
        soft:
          'bg-primary/40 border border-primary text-primary-foreground hover:bg-primary/60 hover:border-primary/70',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
        outline: 'text-foreground',
        success:
          'dark:border-emerald-600 dark:text-emerald-400 dark:bg-emerald-900/50 border-emerald-500 text-emerald-500 bg-emerald-400/20',
        warning:
          'dark:border-amber-500 dark:text-amber-500 dark:bg-amber-900/50 border-amber-500 text-amber-500 bg-amber-400/20',
        danger:
          'dark:border-red-500 dark:text-red-500 dark:bg-red-900/50 border-red-500 text-red-500 bg-red-400/20',
        [BadgeVariant.SOLICITADO.value]:
          'dark:border-blue-500 dark:text-blue-400 dark:bg-blue-900/50 border-blue-500 text-blue-500 bg-blue-400/20',
        [BadgeVariant.PENDENTE.value]:
          'dark:border-yellow-500 dark:text-yellow-400 dark:bg-yellow-900/50 border-yellow-500 text-yellow-500 bg-yellow-400/20',
        [BadgeVariant.INTEGRADO.value]:
          'dark:border-teal-500 dark:text-teal-400 dark:bg-teal-900/50 border-teal-500 text-teal-500 bg-teal-400/20',
        [BadgeVariant.GERADO.value]:
          'dark:border-orange-500 dark:text-orange-400 dark:bg-orange-900/50 border-orange-500 text-orange-500 bg-orange-400/20',
        [BadgeVariant.COMPENSADO.value]:
          'dark:border-green-600 dark:text-green-400 dark:bg-green-900/50 border-green-500 text-green-500 bg-green-400/20',
        [BadgeVariant.EXPIRADO.value]:
          'dark:border-gray-600 dark:text-gray-400 dark:bg-gray-900/50 border-gray-500 text-gray-500 bg-gray-400/20',
        [BadgeVariant.CANCELADO.value]:
          'dark:border-red-500 dark:text-red-500 dark:bg-red-900/50 border-red-500 text-red-500 bg-red-400/20',
        [CobrancaStatusVariant.ATIVA.value]: 'dark:border-blue-500 dark:text-blue-400 dark:bg-blue-900/50 border-blue-500 text-blue-500 bg-blue-400/20',
        [CobrancaStatusVariant.FINALIZADA.value]: 'dark:border-green-600 dark:text-green-400 dark:bg-green-900/50 border-green-500 text-green-500 bg-green-400/20',
        [CobrancaStatusVariant.QUITADA.value]: 'dark:border-teal-500 dark:text-teal-400 dark:bg-teal-900/50 border-teal-500 text-teal-500 bg-teal-400/20',
        [CobrancaStatusVariant.ENCERRADA.value]: 'dark:border-gray-600 dark:text-gray-400 dark:bg-gray-900/50 border-gray-500 text-gray-500 bg-gray-400/20',
        [CobrancaStatusVariant.CANCELADA.value]:
          'dark:border-red-500 dark:text-red-500 dark:bg-red-900/50 border-red-500 text-red-500 bg-red-400/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export type BadgeVariants = VariantProps<typeof badgeVariants>
