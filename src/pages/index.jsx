export default function Index() {
  return <div className='w-full h-full'>123</div>
}
export async function getStaticProps() {
  return { props: { title: 'Agape Ecosystem' } }
}
