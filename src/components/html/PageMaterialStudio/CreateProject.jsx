import { MaterialProject } from '@/backend/aws-material-project'
import nProgress from 'nprogress'
import { useRef } from 'react'

export function CreateProject() {
  let nameRef = useRef()
  return (
    <div className='mb-3'>
      <div className='form-control'>
        <label className='label'>
          <span className='label-text'>Create new project</span>
        </label>
        <label className='input-group'>
          <span className='bg-white border border-r-0 border-gray-400'>Project Name</span>
          <input
            ref={nameRef}
            type='text'
            placeholder='My New Project'
            className='border-gray-400 input input-bordered'
          />
          <span
            className='text-white bg-blue-500 cursor-pointer'
            onClick={async () => {
              //
              nProgress.start()
              await MaterialProject.create({
                object: {
                  //
                  name: nameRef.current.value,
                },
              })

              MaterialProject.listAll({})
                .then((response) => {
                  MaterialProject.state.items = response.result
                })
                .catch((r) => {
                  console.error(r)
                })
                .finally(() => {
                  nProgress.done()
                })
            }}>
            Create
          </span>
        </label>
      </div>
    </div>
  )
}
