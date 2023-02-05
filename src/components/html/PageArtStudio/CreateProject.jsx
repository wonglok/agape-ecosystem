export function CreateProject() {
  return (
    <div className='mb-3'>
      <div className='form-control'>
        <label className='label'>
          <span className='label-text'>Create your new project</span>
        </label>
        <label className='input-group'>
          <span className='bg-white border border-r-0 border-gray-400'>Project Name</span>
          <input type='text' placeholder='My New Art Project' className='border-gray-400 input input-bordered' />
          <span
            className='text-white bg-blue-500 cursor-pointer'
            onClick={() => {
              //
            }}>
            Create
          </span>
        </label>
      </div>
    </div>
  )
}
