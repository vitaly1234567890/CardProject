import { ComponentPropsWithoutRef, ElementRef, ReactNode, forwardRef } from 'react'

import { Icons } from '@/assets/icons/Icons'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Typography } from '@/components/ui/typography'
import * as Dialog from '@radix-ui/react-dialog'
import clsx from 'clsx'

import s from './modal.module.scss'

export type ModalProps = {
  children?: ReactNode
  className?: string
  isOpen: boolean
  onChange?: (isOpen: boolean) => void
  title?: string
  titleBtn?: string
} & ComponentPropsWithoutRef<typeof Dialog.Root>

export const Modal = forwardRef<ElementRef<typeof Dialog.Root>, ModalProps>(
  ({ isOpen, onChange, ...rest }, ref) => {
    const classes = {
      close: s.close,
      content: clsx(s.content, rest.className),
      overlay: s.overlay,
      title: clsx(s.text, rest.className),
    }

    return (
      <Dialog.Root open={isOpen} {...rest}>
        <Dialog.Trigger asChild>
          <Button
            aria-label={'Open'}
            onClick={() => onChange && onChange(true)}
            variant={'primary'}
          >
            {rest.titleBtn}
          </Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className={classes.overlay} ref={ref} />
          <Dialog.Content asChild className={classes.content}>
            <Card className={s.card}>
              {rest.title && (
                <Typography as={'div'} className={classes.title}>
                  <Typography as={'h3'} variant={'h3'}>
                    {rest.title}
                  </Typography>
                  <Dialog.Close
                    aria-label={'Close'}
                    className={classes.close}
                    onClick={() => onChange && onChange(false)}
                  >
                    <Icons className={s.icon} iconId={'close'} />
                  </Dialog.Close>
                </Typography>
              )}
              {rest.children}
            </Card>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    )
  }
)
