/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */
import { Gate } from '@/backend/Gate'
import { AdminLayout } from '../AdminLayout/AdminLayout'
import { CreateProject } from './CreateProject'
import { OneProject } from './OneProject'

export function PageArtStudio() {
  return (
    <Gate>
      <AdminLayout>
        <div className='navbar bg-base-200 rounded-box'>
          <a className='text-xl normal-case btn btn-ghost'>My ART Projects</a>
        </div>

        <CreateProject></CreateProject>

        <div className='pt-3'>
          <OneProject></OneProject>
          <OneProject></OneProject>
          <OneProject></OneProject>
          <OneProject></OneProject>
          <OneProject></OneProject>
        </div>
      </AdminLayout>
    </Gate>
  )
}

//

//

//

//
