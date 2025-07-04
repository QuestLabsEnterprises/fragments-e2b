import Logo from './logo'
import { CopyButton } from './ui/copy-button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { publish } from '@/app/actions/publish'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Duration } from '@/lib/duration'
import { usePostHog } from 'posthog-js/react'
import { useEffect, useState } from 'react'

export function DeployDialog({
  url,
  sbxId,
  teamID,
  accessToken,
}: {
  url: string
  sbxId: string
  teamID: string | undefined
  accessToken: string | undefined
}) {
  const posthog = usePostHog()

  const [publishedURL, setPublishedURL] = useState<string | null>(null)
  const [duration, setDuration] = useState<string | null>(null)

  useEffect(() => {
    setPublishedURL(null)
  }, [url])

  async function publishURL(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const { url: publishedURL } = await publish(
      url,
      sbxId,
      duration as Duration,
      teamID,
      accessToken,
    )
    setPublishedURL(publishedURL)
    posthog.capture('publish_url', {
      url: publishedURL,
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" className="paper-elevated">
          <Logo style="canvas" width={16} height={16} className="mr-2" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-4 w-80 flex flex-col gap-2 paper-elevated">
        <div className="text-sm font-semibold">Share Your App</div>
        <div className="text-sm text-muted-foreground">
          Sharing the app will make it publicly accessible to others via
          link.
        </div>
        <div className="text-sm text-muted-foreground">
          The app will be available up until the expiration date you choose.
        </div>
        <form className="flex flex-col gap-2" onSubmit={publishURL}>
          {publishedURL ? (
            <div className="flex items-center gap-2">
              <Input value={publishedURL} readOnly />
              <CopyButton content={publishedURL} />
            </div>
          ) : (
            <Select onValueChange={(value) => setDuration(value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Set expiration" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Expires in</SelectLabel>
                  <SelectItem value="30m">30 Minutes</SelectItem>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="3h">3 Hours</SelectItem>
                  <SelectItem value="6h">6 Hours</SelectItem>
                  <SelectItem value="1d">1 Day</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
          <Button
            type="submit"
            variant="default"
            disabled={publishedURL !== null}
          >
            {publishedURL ? 'Shared' : 'Accept and share'}
          </Button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}