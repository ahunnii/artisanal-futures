import { useEffect, useRef, useState, type FC } from "react";
import Webcam from "react-webcam";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
interface IProps {
  launchCamera?: boolean;
  onSnap: (screenshot: string | null) => void;
}

const Camera: FC<IProps> = ({ launchCamera = false, onSnap }) => {
  const [open, setOpen] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const handleSnap = () => {
    const screenshot = webcamRef?.current?.getScreenshot();
    onSnap(screenshot ?? "");
    setIsCameraOn(false);
  };

  useEffect(() => {
    if (typeof launchCamera !== "undefined") {
      setOpen(launchCamera);
    }
  }, [launchCamera]);

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Take a snapshot!</DialogTitle>
          <DialogDescription>
            {isCameraOn ? (
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  facingMode: "user",
                }}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={webcamRef?.current?.getScreenshot() ?? ""}
                alt="Captured"
              />
            )}

            <DialogFooter>
              <Button
                type="button"
                variant={"secondary"}
                onClick={() => setOpen(!open)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                id="snap-button"
                onClick={handleSnap}
                disabled={!isCameraOn}
              >
                Snap!
              </Button>
            </DialogFooter>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default Camera;
