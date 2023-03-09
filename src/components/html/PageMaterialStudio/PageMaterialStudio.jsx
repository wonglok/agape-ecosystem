/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */
import { Gate } from '@/backend/Gate'
import { AdminLayout } from '../AdminLayout/AdminLayout'
import { CreateProject } from './CreateProject'
import { OneProject } from './OneProject'
import { useEffect } from 'react'
import { MaterialProject } from '@/backend/aws-material-project'
import { useSnapshot } from 'valtio'

export function PageMaterialStudio() {
  useEffect(() => {
    //!SECTION

    MaterialProject.listAll({}).then((response) => {
      MaterialProject.state.items = response.result
    })
  }, [])
  //

  let material = useSnapshot(MaterialProject.state)
  return (
    <Gate>
      <AdminLayout>
        <div className='navbar bg-base-200 rounded-box'>
          <a className='text-xl normal-case btn btn-ghost'>Material Projects</a>
        </div>

        <CreateProject></CreateProject>

        <div className='pt-3'>
          {JSON.parse(JSON.stringify(material.items || []))
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
              return <OneProject key={it.oid} data={it}></OneProject>
            })}
        </div>
      </AdminLayout>
    </Gate>
  )
}

//

//

//

//
