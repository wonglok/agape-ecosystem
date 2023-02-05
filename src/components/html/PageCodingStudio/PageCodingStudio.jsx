/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */
import { Gate } from '@/backend/Gate'
import { AdminLayout } from '../AdminLayout/AdminLayout'
import { CreateAppProject } from './CreateAppProject'
import { OneAppProject } from './OneAppProject'
import { useSnapshot } from 'valtio'
import { AppProject } from '@/backend/aws-app-project'

export function PageCodingStudio() {
  let app = useSnapshot(AppProject.state)
  return (
    <Gate>
      <AdminLayout>
        <div className='navbar bg-base-200 rounded-box'>
          <a className='text-xl normal-case btn btn-ghost'>My 3D App Projects</a>
        </div>

        <CreateAppProject></CreateAppProject>

        <div className='pt-3'>
          {JSON.parse(JSON.stringify(app.items))
            .sort((a, b) => {
              if (a.createdAt < b.createdAt) {
                return 1
              }
              if (a.createdAt > b.createdAt) {
                return -1
              }
              return 0
            })
            .map((it) => {
              return <OneAppProject key={it.oid} data={it}></OneAppProject>
            })}
        </div>
      </AdminLayout>
    </Gate>
  )
}

//
