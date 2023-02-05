import { ArtProject } from '@/backend/aws-art-project'

export function OneProject({ data }) {
  return (
    <div className='inline-block mb-5 mr-5 shadow-xl w-72 card bg-base-100'>
      <figure className='h-52'>
        <img src='/img/user-image/yo/punk.jpg' alt='Shoes' />
      </figure>
      <div className='p-4'>
        <h2 className='card-title'>
          <textarea
            defaultValue={data.name}
            className='w-full p-2 mb-3 resize-none textarea textarea-bordered'
            rows={1}
            placeholder='Bio'></textarea>
        </h2>
        <div>
          <textarea
            className='w-full p-2 resize-y textarea textarea-bordered'
            defaultValue={`If a dog chews shoes whose shoes does he choose?`}
            rows={3}
            placeholder='Bio'></textarea>
        </div>
        <div>
          <div className='w-full form-control'>
            <label className='cursor-pointer label'>
              <span className='label-text'>Private Project</span>
              <input type='checkbox' className='toggle toggle-accent' />
            </label>
          </div>
        </div>
        <div className='justify-end mt-5 card-actions'>
          <button
            className='text-xs btn btn-error'
            onClick={(ev) => {
              //
              ev.target.classList.toggle('loading')
              ArtProject.remove({ oid: data.oid })
                .then(() => {})
                .finally(() => {
                  ev.target.classList.toggle('loading')
                })
            }}>
            Remove
          </button>
          <button className='text-xs btn btn-primary'>Edit</button>
        </div>
      </div>
    </div>
  )
}

//
