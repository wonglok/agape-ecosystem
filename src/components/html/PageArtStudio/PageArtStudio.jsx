/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */
import { Gate } from '@/backend/Gate'
import { AdminLayout } from '../AdminLayout/AdminLayout'
import { CreateProject } from './CreateProject'
import { OneProject } from './OneProject'
import { useEffect } from 'react'
import { ArtProject } from '@/backend/aws-art-project'
import { useSnapshot } from 'valtio'

export function PageArtStudio() {
  useEffect(() => {
    //!SECTION

    ArtProject.listAll({})
  }, [])

  let artp = useSnapshot(ArtProject.state)
  return (
    <Gate>
      <AdminLayout>
        <div className='navbar bg-base-200 rounded-box'>
          <a className='text-xl normal-case btn btn-ghost'>My 3D Art Projects</a>
        </div>

        <CreateProject></CreateProject>

        <div className='pt-3'>
          {artp.items
            .slice()
            .reverse()
            .map((it) => {
              //
              return <OneProject key={it.oid} data={it}></OneProject>
            })}
          {/* <OneProject></OneProject>
          <OneProject></OneProject>
          <OneProject></OneProject>
          <OneProject></OneProject> */}
        </div>
      </AdminLayout>
    </Gate>
  )
}

//

//

//

//
