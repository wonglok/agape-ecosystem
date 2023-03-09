import { Landing } from '@/components/html/Landing/Landing'

export default Landing

export async function getStaticProps() {
  return { props: { title: 'Agape Ecosystem' } }
}

//
