import { Button } from "@tribal-cities/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@tribal-cities/ui/card";
import { Checkbox } from "@tribal-cities/ui/checkbox";
import { Input } from "@tribal-cities/ui/input";

export default async function Page() {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="grid gap-6">
        <Card x-chunk="dashboard-04-chunk-1">
          <CardHeader>
            <CardTitle>Burn Name</CardTitle>
            <CardDescription>
              The name you want us to address you by.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <Input placeholder="Store Name" />
            </form>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button>Save</Button>
          </CardFooter>
        </Card>
        <Card x-chunk="dashboard-04-chunk-2">
          <CardHeader>
            <CardTitle>Plugins Directory</CardTitle>
            <CardDescription>
              The directory within your project, in which your plugins are
              located.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4">
              <Input
                placeholder="Project Name"
                defaultValue="/content/plugins"
              />
              <div className="flex items-center space-x-2">
                <Checkbox id="include" defaultChecked />
                <label
                  htmlFor="include"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Allow administrators to change the directory.
                </label>
              </div>
            </form>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button>Save</Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
