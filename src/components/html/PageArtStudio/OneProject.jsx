export function OneProject() {
  return (
    <div className='inline-block shadow-xl mb-7 mr-7 w-72 card bg-base-100'>
      <figure className='h-48'>
        <img src='/img/user-image/yo/punk.jpg' alt='Shoes' />
      </figure>
      <div className='p-5'>
        <h2 className='card-title'>
          <textarea
            defaultValue={`My First Project`}
            className='w-full p-2 mb-3 resize-none textarea textarea-bordered'
            rows={1}
            placeholder='Bio'></textarea>
        </h2>
        <p>
          <textarea
            className='w-full p-2 resize-y textarea textarea-bordered'
            defaultValue={`If a dog chews shoes whose shoes does he choose?`}
            rows={3}
            placeholder='Bio'></textarea>
        </p>
        <p>
          <div className='w-full form-control'>
            <label className='cursor-pointer label'>
              <span className='label-text'>Private Project</span>
              <input type='checkbox' className='toggle toggle-accent' />
            </label>
          </div>
        </p>
        <div className='justify-end mt-5 card-actions'>
          <button className='text-xs btn btn-error'>Remove</button>
          <button className='text-xs btn btn-primary'>Edit</button>
        </div>
      </div>
    </div>
  )
}

//
