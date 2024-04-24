import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { NavLink } from 'react-router-dom'

import { Icons } from '@/assets/icons/Icons'
import { FormTextField } from '@/components/formComponents/formTextField'
import { Avatar } from '@/components/ui/avatar/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ImageUploader, imageSchema } from '@/components/ui/imageUploader/imageUploader'
import { Typography } from '@/components/ui/typography'
import { ROUTES } from '@/router/router'
import { User } from '@/services/auth/auth.types'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import s from './personalInformation.module.css'

const NameSchema = z.object({
  name: z.string().min(3).trim(),
})

export type NameValues = z.infer<typeof NameSchema>
export type AvatarValues = z.infer<typeof imageSchema>

type Props = {
  data?: User
  logout: () => void
  updateAvatar: (avatar: AvatarValues) => Promise<void>
  updateName: (data: { name: string }) => void
}

export const PersonalInformation = (props: Props) => {
  const { data, logout, updateAvatar, updateName } = props

  const [editMode, setEditMode] = useState(false)
  const [avatar, setAvatar] = useState<File | null>(null)
  const ref = useRef<HTMLInputElement>(null)

  const updateAvatarHandler = async (avatar: File | null) => {
    if (avatar) {
      await updateAvatar(avatar)
      setAvatar(avatar)
    }
  }

  const onClickAvatar = () => {
    ref.current?.click()
  }

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<NameValues>({
    defaultValues: { name: data?.name ?? 'User' },
    resolver: zodResolver(NameSchema),
  })

  const onSubmitHandler = (formData: NameValues) => {
    updateName(formData)
    setEditMode(false)
  }

  return (
    <Card className={s.personalInformation}>
      <Typography as={'span'} variant={'h1'}>
        Personal Information
      </Typography>
      <div className={s.avatarWrapper}>
        <Avatar
          className={s.avatar}
          height={'96px'}
          src={avatar ? URL.createObjectURL(avatar) : data?.avatar || undefined}
          width={'96px'}
        />
        {!editMode && (
          <ImageUploader
            ref={ref}
            setFile={updateAvatarHandler}
            trigger={
              <Button className={s.editButton} onClick={onClickAvatar}>
                <Icons className={s.icons} iconId={'edit-2-outline'} />
              </Button>
            }
          />
        )}
      </div>

      {editMode ? (
        <form className={s.form} onSubmit={handleSubmit(onSubmitHandler)}>
          <FormTextField
            control={control}
            error={errors.name?.message}
            label={'Name'}
            name={'name'}
            type={'text'}
          />
          <Button className={s.saveButton} fullWidth type={'submit'} variant={'primary'}>
            Save Changes
          </Button>
        </form>
      ) : (
        <>
          <div className={s.avatarWrapper}>
            <Typography className={s.name} variant={'h2'}>
              {data?.name}
            </Typography>
            <Button className={s.editButton2} onClick={() => setEditMode(true)}>
              <Icons className={s.icons} iconId={'edit-2-outline'} />
            </Button>
          </div>
          <div className={s.content}>
            <Typography as={'span'} className={s.email} variant={'body2'}>
              {data?.email}
            </Typography>
            <Typography
              as={NavLink}
              className={s.link}
              to={ROUTES.createNewPassword}
              variant={'link1'}
            >
              Create new password?
            </Typography>
            <Button as={'button'} className={s.logout} onClick={logout} variant={'secondary'}>
              <Icons iconId={'log-out-outline'} /> Logout
            </Button>
          </div>
        </>
      )}
    </Card>
  )
}
