import { data } from "../../data/data";
import { cardStyles } from "../../data/data";

const States = () => {
  return (
    <div className="pt-21 mr-5 ml-5">
      <div className="max-w-8xl mx-auto">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {data.map((items) => {
            const style = cardStyles[items.id];
            return (
              <div
                key={items.id}
                className={`${style.card} border rounded-lg p-4 flex items-center gap-3 justify-between`}
              >
                <div>
                  <h1 className="text-sm mb-7 text-mutes-foreground">
                    {items.lable}
                  </h1>
                  <p className="text-5xl text-mutes">{items.value}</p>
                </div>
                <div className={`mr-5 ${style.icon} rounded-lg border p-3`}>
                  {items.icons}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default States;
