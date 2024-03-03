import { Button } from '@/components/ui/button'

export function App() {
  return (
    <div>
      <p>Hi!</p>
      <Button as={'a'} href={'/link'} variant={'secondary'}>
        Hello
      </Button>
    </div>
  )
}
