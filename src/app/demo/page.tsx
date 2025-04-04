'use client'

import * as React from 'react'
import {
  Alert,
  Progress,
  Skeleton,
  Spinner,
  Checkbox,
  Radio,
  Switch,
  Toggle,
  Button,
  Input,
  Card,
  Badge,
  Tabs,
} from '@/components/ui'

export default function DemoPage() {
  const [progress, setProgress] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 10))
    }, 1000)

    const loadingTimer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => {
      clearInterval(timer)
      clearTimeout(loadingTimer)
    }
  }, [])

  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8">UI Components Demo</h1>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Feedback Components</h2>
        
        <div className="space-y-4">
          <Alert variant="info" title="Info Alert" description="This is an info alert" />
          <Alert variant="success" title="Success Alert" description="This is a success alert" />
          <Alert variant="warning" title="Warning Alert" description="This is a warning alert" />
          <Alert variant="error" title="Error Alert" description="This is an error alert" />
        </div>

        <div className="space-y-4">
          <Progress value={progress} showValue />
          <Progress value={progress} variant="success" showValue />
          <Progress value={progress} variant="warning" showValue />
          <Progress value={progress} variant="error" showValue />
        </div>

        <div className="space-y-4">
          <Skeleton variant="text" width="100%" height="2rem" />
          <Skeleton variant="circular" width="4rem" height="4rem" />
          <Skeleton variant="rectangular" width="100%" height="8rem" />
        </div>

        <div className="flex gap-4">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
          <Spinner variant="success" />
          <Spinner variant="warning" />
          <Spinner variant="error" />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Data Input Components</h2>
        
        <div className="space-y-4">
          <Checkbox label="Checkbox 1" />
          <Checkbox label="Checkbox 2" error="This is an error message" />
          <Checkbox label="Checkbox 3" helperText="This is a helper text" />
        </div>

        <div className="space-y-4">
          <Radio label="Radio 1" name="radio-group" />
          <Radio label="Radio 2" name="radio-group" error="This is an error message" />
          <Radio label="Radio 3" name="radio-group" helperText="This is a helper text" />
        </div>

        <div className="space-y-4">
          <Switch label="Switch 1" />
          <Switch label="Switch 2" error="This is an error message" />
          <Switch label="Switch 3" helperText="This is a helper text" />
        </div>

        <div className="space-y-4">
          <Toggle label="Toggle 1" />
          <Toggle label="Toggle 2" active />
          <Toggle label="Toggle 3" error="This is an error message" />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Basic Components</h2>
        
        <div className="space-y-4">
          <Button>Default Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="link">Link Button</Button>
        </div>

        <div className="space-y-4">
          <Input placeholder="Default Input" />
          <Input placeholder="Error Input" error="This is an error message" />
          <Input placeholder="Helper Text Input" helperText="This is a helper text" />
        </div>

        <div className="space-y-4">
          <Card>
            <Card.Header>
              <Card.Title>Card Title</Card.Title>
              <Card.Description>Card Description</Card.Description>
            </Card.Header>
            <Card.Content>
              <p>Card Content</p>
            </Card.Content>
            <Card.Footer>
              <p>Card Footer</p>
            </Card.Footer>
          </Card>
        </div>

        <div className="space-y-4">
          <Badge>Default Badge</Badge>
          <Badge variant="secondary">Secondary Badge</Badge>
          <Badge variant="destructive">Destructive Badge</Badge>
          <Badge variant="outline">Outline Badge</Badge>
        </div>

        <div className="space-y-4">
          <Tabs defaultValue="tab1">
            <Tabs.List>
              <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
              <Tabs.Trigger value="tab3">Tab 3</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="tab1">Tab 1 Content</Tabs.Content>
            <Tabs.Content value="tab2">Tab 2 Content</Tabs.Content>
            <Tabs.Content value="tab3">Tab 3 Content</Tabs.Content>
          </Tabs>
        </div>
      </section>
    </div>
  )
} 