// useLCPMeasurement.js
import { useEffect } from "react";

export const useLCPMeasurement = () => {
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      const lcpEntry = list.getEntries().at(-1);
      if (!lcpEntry?.url) return;

      const navEntry = performance.getEntriesByType("navigation")[0];
      const resEntries = performance.getEntriesByType("resource");
      const lcpResEntry = resEntries.filter((e) => e.name === lcpEntry.url)[0];

      const docTIFB = navEntry.responseStart;

      const lcpRequestStart = Math.max(
        docTIFB,
        lcpResEntry ? lcpResEntry.requestStart : 0
      );

      const lcpResponseEnd = Math.max(
        lcpRequestStart,
        lcpResEntry ? lcpResEntry.responseEnd : 0
      );

      const lcpRenderTime = Math.max(
        lcpResponseEnd,
        lcpEntry ? lcpEntry.startTime : 0
      );

      console.log("LCP: ", lcpRenderTime, lcpEntry.element);
      console.log("document_tifb", docTIFB);
      console.log("resource_load_delay", lcpRequestStart - docTIFB);
      console.log("resource_load_time", lcpResponseEnd - lcpRequestStart);
      console.log("element_render_delay", lcpRenderTime - lcpResponseEnd);

      performance.measure("document_tifb", { start: 0, end: docTIFB });

      performance.measure("resource_load_delay", {
        start: docTIFB,
        end: lcpRequestStart,
      });

      performance.measure("resource_load_time", {
        start: lcpRequestStart,
        end: lcpResponseEnd,
      });

      performance.measure("element_render_delay", {
        start: lcpResponseEnd,
        end: lcpRenderTime,
      });
    });

    observer.observe({ type: "largest-contentful-paint", buffered: true });

    // Cleanup function to disconnect the observer when component unmounts
    return () => observer.disconnect();
  }, []);
};
