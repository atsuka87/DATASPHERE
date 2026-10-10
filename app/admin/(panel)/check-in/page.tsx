import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/AdminShell";
import QrScanner from "@/components/admin/QrScanner";
import { requireStaff } from "@/lib/auth";

export const metadata: Metadata = { title: "Check-in" };

export default async function CheckinPage() {
  await requireStaff();
  return (
    <div className="flex flex-col gap-[20px]">
      <PageHeader
        eyebrow="Hari acara"
        title="Check-in Peserta"
        description="Pindai QR registrasi peserta lomba atau seminar untuk melihat datanya dan menandai kehadiran."
      />
      <QrScanner />
    </div>
  );
}
