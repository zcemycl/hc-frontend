import { ListPageTemplate, ProfileBar, ProtectedRoute } from "@/components";

export default function Page() {
  return (
    <ProtectedRoute>
      <ListPageTemplate>
        <ProfileBar title={"Bundle"} />
      </ListPageTemplate>
    </ProtectedRoute>
  );
}
