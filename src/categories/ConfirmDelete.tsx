import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { ICategory } from "../types/category";

interface Props {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    category?: ICategory;
    confirmDelete: () => void;
}
const ConfirmDelete = ({
    isOpen,
    setIsOpen,
    category,
    confirmDelete,
}: Props) => {

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you want to delete {category?.name}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => confirmDelete()}>
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ConfirmDelete;