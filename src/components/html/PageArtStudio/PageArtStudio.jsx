/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */
import { Gate } from '@/backend/Gate'
import { AdminLayout } from '../AdminLayout/AdminLayout'

export function PageArtStudio() {
  return (
    <Gate>
      <AdminLayout>
        <div className='navbar bg-base-200 rounded-box'>
          <a className='text-xl normal-case btn btn-ghost'>My ART Projects</a>
        </div>

        <div className=''>
          <div class='form-control'>
            <label class='label'>
              <span class='label-text'>Create your new project</span>
            </label>
            <label class='input-group'>
              <span>Name</span>
              <input type='text' placeholder='YoArt' class='input input-bordered' />
              <span className='text-white bg-blue-500'>Submit</span>
            </label>
          </div>
        </div>

        <div className='pt-3'>
          <div className='shadow-xl w-72 card bg-base-100'>
            <figure className='h-48'>
              <img src='/img/user-image/yo/punk.jpg' alt='Shoes' />
            </figure>
            <div className='p-5'>
              <h2 className='card-title'>
                <textarea class='w-full p-2 mb-3 resize-none textarea textarea-bordered' rows={1} placeholder='Bio'>
                  My First Project
                </textarea>
              </h2>
              <p>
                <textarea class='w-full p-2 resize-y textarea textarea-bordered' rows={3} placeholder='Bio'>
                  If a dog chews shoes whose shoes does he choose?
                </textarea>
              </p>
              <div className='justify-end mt-5 card-actions'>
                <button className='text-xs btn btn-primary'>Edit</button>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </Gate>
  )
}

//

//

//

//
