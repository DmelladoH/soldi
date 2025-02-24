import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export default async function UserFooter() {
  const user = await currentUser();
  return (
    <div className="mb-10 p-4">
      <div className="flex gap-3">
        <UserButton />
        <span>{user?.fullName}</span>
      </div>
    </div>
  );
}
