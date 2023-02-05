/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */
import { Gate } from '@/backend/Gate'
import { AdminLayout } from '../AdminLayout/AdminLayout'

export function PageCodingStudio() {
  return (
    <Gate>
      <AdminLayout>Coding Studio</AdminLayout>
    </Gate>
  )
}

//
