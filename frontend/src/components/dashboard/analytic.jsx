import { Chart } from "./chart";
import { PieChartComponent } from "./pieChart";

const Analytic = () => {
  return (
    <section>
      <div className="mt-5 mb-5 mr-5 ml-5">
        <div className="max-w-8xl mx-auto">
          <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 h-full">
            <Chart />
            <PieChartComponent />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Analytic;
