import React from "react";
import PictureCard from "./PictureCard";
import { PropertyImage } from "@prisma/client";
import FileInput from "@/app/components/fileUpload";
import { Button, Card, cn } from "@nextui-org/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";

interface Props {
  next: () => void;
  prev: () => void;
  className?: string;
  images: File[];
  setImages: (images: File[]) => void;
  savedImagesUrl?: PropertyImage[];
  setSavedImageUrl?: (propertyImages: PropertyImage[]) => void;
}

const Picture = (props: Props) => {
  const { savedImagesUrl, setSavedImageUrl, images, setImages } = props;

  return (
    <Card className={cn("p-3", props.className)}>
      <FileInput
        onSelect={(e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (!file) return;

          setImages([file, ...images]);
        }}
      />

      <div className="flex gap-3 flex-wrap">
        {savedImagesUrl?.map((image, index) => (
          <PictureCard
            key={image.id}
            src={image.url}
            index={index}
            onDelete={() => {
              setSavedImageUrl?.(
                savedImagesUrl.filter((img) => img.id !== image.id),
              );
            }}
          />
        ))}

        {images.map((image, index) => {
          const srcUrl = URL.createObjectURL(image);
          return (
            <PictureCard
              key={srcUrl}
              src={srcUrl}
              index={index}
              onDelete={(i) =>
                setImages([...images.slice(0, i), ...images.slice(i + 1)])
              }
            />
          );
        })}
      </div>

      <div className="flex justify-center col-span-2 gap-3 mt-3">
        <Button
          onClick={props.prev}
          startContent={<ChevronLeftIcon className="w-6" />}
          color="primary"
          className="w-36"
        >
          Previous
        </Button>
        <Button
          onClick={props.next}
          endContent={<ChevronRightIcon className="w-6" />}
          color="primary"
          className="w-36"
        >
          Next
        </Button>
      </div>
    </Card>
  );
};

export default Picture;
