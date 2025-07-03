import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export default async function UserFooter() {
  const user = await currentUser();
  return (
    <div className="flex gap-2 sm:gap-3 items-center">
      <UserButton />
      <span className="text-sm sm:text-base font-medium truncate max-w-[120px] sm:max-w-[150px]">
        {user?.fullName}
      </span>
    </div>
  );
}
