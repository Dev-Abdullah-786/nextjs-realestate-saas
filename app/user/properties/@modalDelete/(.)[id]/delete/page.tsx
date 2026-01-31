"use client";
import {
    Button,
    Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteProperty } from "@/lib/actions/property";

interface Props {
  params: { id: string };
}
const ModalDeletePropertyPage = ({ params }: Props) => {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();


  const handldeDelete = async () => {
    try {
      await deleteProperty(Number(params.id));

      router.push("/user/properties");

      setIsOpen(false);
    } catch (e) {
      throw e;
    }
  };

  const handleCancel = () => {
    router.push("/user/properties");
    setIsOpen(false);
  };
  return (
    <Modal isOpen={isOpen} onOpenChange={handleCancel}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Delete Property</ModalHeader>
        <ModalBody>
          <p>Are you sure to delete the property?</p>
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handldeDelete} color="danger" variant="light">
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalDeletePropertyPage;
