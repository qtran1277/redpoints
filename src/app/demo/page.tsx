'use client'

import * as React from 'react'
import {
  Alert,
  Progress,
  Skeleton,
  Spinner,
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
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
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-16 h-16 rounded-full" />
          <Skeleton className="w-full h-32" />
        </div>

        <div className="flex gap-4">
          <Spinner className="w-4 h-4" />
          <Spinner className="w-6 h-6" />
          <Spinner className="w-8 h-8" />
          <Spinner className="w-6 h-6 text-green-500" />
          <Spinner className="w-6 h-6 text-yellow-500" />
          <Spinner className="w-6 h-6 text-red-500" />
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
          <Input placeholder="Error Input" className="border-red-500" />
          <Input placeholder="Helper Text Input" />
          <div className="text-sm text-gray-500">This is a helper text</div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card Content</p>
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
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
            <TabsList>
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
              <TabsTrigger value="tab3">Tab 3</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">Tab 1 Content</TabsContent>
            <TabsContent value="tab2">Tab 2 Content</TabsContent>
            <TabsContent value="tab3">Tab 3 Content</TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
} 