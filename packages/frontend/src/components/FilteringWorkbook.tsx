import React, { forwardRef  } from "react";
import useSWR from "swr";
import { Badge, DefaultProps, Group, MultiSelect } from "@mantine/core";
import { fetcher } from "@/fetchers";

interface WorkbookProps extends React.ComponentPropsWithoutRef<'div'> {
  wid: string,
  label: string,
  color: string,
}

export interface Workbook {
  wid: string,
  label: string,
  color: string,
}

interface FilteringWorkbookProps extends DefaultProps {
  value: string[] | undefined,
  onChange: (value: string[]) => void
}

const Item = forwardRef<HTMLDivElement, WorkbookProps>(
  ({ wid, label, color, ...others}: WorkbookProps, ref) => (
  <div ref={ref} {...others}>
    <Group noWrap>
      <Badge
        variant="dot"
        size="lg" 
        radius="sm" 
        color={color}
      >{label}</Badge>
    </Group>
  </div>
))

export default function FilteringWorkbook({ 
  value, 
  onChange,
  ...others
 }: FilteringWorkbookProps ) {
  const { data: workbooks } = useSWR<Workbook[]>('/workbooks/color', fetcher)

  const data = workbooks?.map(({wid, ...others}) => ({...others, value: wid, key: wid}))

  return (
    <MultiSelect
      label="Select Workbooks"
      searchable
      data={data || []}
      itemComponent={Item}
      filter={(value, selected, item) => !selected && (item.label?.includes(value) || false)}
      value={value} 
      onChange={onChange}
      {...others}
    />
  )
}