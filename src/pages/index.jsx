export default function Index() {
  return <div className='w-full h-full'>IndexIndexIndexIndex</div>
}

export async function getStaticProps() {
  return { props: { title: 'Agape Ecosystem' } }
}
