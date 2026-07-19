import { Dialog } from '@gravity-ui/uikit';

import styles from './ConfirmDialog.module.css';

type ConfirmDialogProps = {
    confirmText?: string;
    description: string;
    onClose: () => void;
    onConfirm: () => void;
    open: boolean;
    title: string;
};

export function ConfirmDialog({
    confirmText = 'Удалить',
    description,
    onClose,
    onConfirm,
    open,
    title,
}: ConfirmDialogProps) {
    return (
        <Dialog open={open} onClose={onClose} size="s" hasCloseButton>
            <Dialog.Header caption={title} />
            <Dialog.Body>
                <p className={styles.description}>{description}</p>
            </Dialog.Body>
            <Dialog.Footer
                textButtonCancel="Отмена"
                textButtonApply={confirmText}
                onClickButtonCancel={onClose}
                onClickButtonApply={() => {
                    onConfirm();
                    onClose();
                }}
            />
        </Dialog>
    );
}
