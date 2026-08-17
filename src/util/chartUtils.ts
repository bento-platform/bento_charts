import { useMemo } from 'react';
import { RADIAN } from '../constants/chartConstants';
import type { CategoricalChartDataType, CategoricalChartDataWithTransforms } from '../types/chartTypes';

export const polarToCartesian = (cx: number, cy: number, radius: number, angle: number) => {
  return {
    x: cx + Math.cos(-RADIAN * angle) * radius,
    y: cy + Math.sin(-RADIAN * angle) * radius,
  };
};

export function useTransformedChartData(
  originalData: CategoricalChartDataType,
  dwt: CategoricalChartDataWithTransforms,
  defaultRemoveEmpty?: boolean,
  sortY?: boolean
): CategoricalChartDataType;
export function useTransformedChartData(
  originalData: undefined,
  dwt: CategoricalChartDataWithTransforms,
  defaultRemoveEmpty?: boolean,
  sortY?: boolean
): undefined;
export function useTransformedChartData(
  originalData: CategoricalChartDataType | undefined,
  dwt: CategoricalChartDataWithTransforms,
  defaultRemoveEmpty?: boolean,
  sortY?: boolean
): CategoricalChartDataType | undefined;
export function useTransformedChartData(
  originalData: CategoricalChartDataType | undefined,
  { preFilter, dataMap, postFilter, removeEmpty: origRemoveEmpty }: CategoricalChartDataWithTransforms,
  defaultRemoveEmpty = true,
  sortY = false
) {
  return useMemo(() => {
    if (originalData === undefined) return undefined;

    const removeEmpty = origRemoveEmpty ?? defaultRemoveEmpty;

    let data = [...originalData];

    if (preFilter) data = data.filter(preFilter);
    if (dataMap) data = data.map(dataMap);
    if (postFilter) data = data.filter(postFilter);

    if (removeEmpty) data = data.filter((e) => e.y !== 0);

    if (sortY) data.sort((a, b) => a.y - b.y);

    return data;
  }, [dataMap, defaultRemoveEmpty, originalData, origRemoveEmpty, preFilter, postFilter, sortY]);
}
