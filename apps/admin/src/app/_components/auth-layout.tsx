import SideNav from "./side-nav";
import TopNav from "./top-nav";

export function AuthLayout(props: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SideNav />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <TopNav />
        {props.children}
      </div>
    </div>
  );
}
