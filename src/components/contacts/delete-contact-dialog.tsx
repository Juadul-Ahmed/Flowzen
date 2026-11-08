
"use client";

import { AlertDialog, Button } from "@heroui/react";
import { Trash2 } from "lucide-react";

interface DeleteContactDialogProps {
  contactName: string;
  isDeleting?: boolean;
  onConfirm: () => void;
}

export default function DeleteContactDialog({
  contactName,
  isDeleting = false,
  onConfirm,
}: DeleteContactDialogProps) {
  return (
    <AlertDialog>
      <Button
        isIconOnly
        size="sm"
        variant="ghost"
        className="text-danger"
        aria-label={`Delete ${contactName}`}
        isDisabled={isDeleting}
      >
        <Trash2 size={15} />
      </Button>

      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-[400px]">
            <AlertDialog.CloseTrigger />

            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>
                Delete contact?
              </AlertDialog.Heading>
            </AlertDialog.Header>

            <AlertDialog.Body>
              <p>
                Are you sure you want to delete{" "}
                <strong>{contactName}</strong>? This contact will be
                removed from your active contacts.
              </p>
            </AlertDialog.Body>

            <AlertDialog.Footer>
              <Button slot="close" variant="tertiary">
                Cancel
              </Button>

              <Button
                slot="close"
                variant="danger"
                isDisabled={isDeleting}
                onPress={onConfirm}
              >
                {isDeleting ? "Deleting..." : "Delete contact"}
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}
