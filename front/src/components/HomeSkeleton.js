import Skeleton from "@mui/material/Skeleton";

function HomeSkeleton() {
  return (
    <div>
      <div className="flex items-center flex-row-reverse ">
        <Skeleton
          variant="rectangular"
          width={230}
          height={40}
          className="mb-4 rounded"
        />
      </div>

      {[...Array(3)].map((_, index) => (
        <div key={index}>
          <div className="flex gap-x-[10px] w-[680px] justify-between">
            <div className="w-[100%]">
              <div className="mb-5">
                <div className="flex mb-1 items-center gap-x-[6px]">
                  <Skeleton variant="circular" width={30} height={30} />
                  <Skeleton variant="text" width={100} height={20} />
                </div>
                <Skeleton variant="text" width="80%" height={30} />
              </div>
              <div className="flex mb-[10px] gap-x-[20px] items-center">
                <Skeleton variant="text" width={100} height={20} />
                <Skeleton variant="rectangular" width={20} height={20} />
              </div>
            </div>
            <div>
              <Skeleton variant="rectangular" width={150} height={140} />
            </div>
          </div>
          <div className="h-[1px] w-[70%] bg-secondary mb-[25px]"></div>
        </div>
      ))}
    </div>
  );
}

export default HomeSkeleton;
