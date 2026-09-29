import { useRef, useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ProgressBackupError,
  MAX_PROGRESS_BACKUP_BYTES,
  downloadProgressBackup,
  importProgressBackup,
} from "@/lib/progressTransfer";

type TransferStatus = {
  kind: "success" | "error";
  message: string;
};

export function ProgressTransfer() {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<TransferStatus | null>(null);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) setStatus(null);
  };

  const handleExport = () => {
    try {
      downloadProgressBackup();
      setStatus({ kind: "success", message: t("progressBackup.exportSuccess") });
    } catch {
      setStatus({ kind: "error", message: t("progressBackup.exportError") });
    }
  };

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;

    if (file.size > MAX_PROGRESS_BACKUP_BYTES) {
      setStatus({ kind: "error", message: t("progressBackup.fileTooLarge") });
      return;
    }

    try {
      const backup = JSON.parse(await file.text()) as unknown;
      const imported = importProgressBackup(backup);
      setStatus({
        kind: "success",
        message: t("progressBackup.importSuccess", imported),
      });
    } catch (error) {
      const message =
        error instanceof ProgressBackupError && error.code === "version"
          ? t("progressBackup.unsupportedVersion")
          : error instanceof ProgressBackupError && error.code === "storage"
            ? t("progressBackup.storageError")
            : t("progressBackup.invalidFile");
      setStatus({ kind: "error", message });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            size="icon"
            variant="outline"
            title={t("header.progressBackup")}
            aria-label={t("header.progressBackup")}
          />
        }
      >
        <Download className="size-4" aria-hidden="true" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("progressBackup.title")}</DialogTitle>
          <DialogDescription>{t("progressBackup.description")}</DialogDescription>
        </DialogHeader>
        <DialogPanel>
          <p className="text-sm text-muted-foreground">
            {t("progressBackup.mergeDescription")}
          </p>
          <input
            ref={fileInputRef}
            accept=".json,application/json"
            aria-label={t("progressBackup.import")}
            className="sr-only"
            onChange={handleImport}
            type="file"
          />
          {status ? (
            <p
              className={`mt-4 text-sm ${status.kind === "error" ? "text-destructive" : "text-success"}`}
              role={status.kind === "error" ? "alert" : "status"}
            >
              {status.message}
            </p>
          ) : null}
        </DialogPanel>
        <DialogFooter>
          <Button onClick={handleExport} type="button" variant="outline">
            <Download className="size-4" aria-hidden="true" />
            {t("progressBackup.export")}
          </Button>
          <Button
            onClick={() => fileInputRef.current?.click()}
            type="button"
          >
            <Upload className="size-4" aria-hidden="true" />
            {t("progressBackup.import")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
