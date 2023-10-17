import { ActionIcon, DefaultProps, Popover, UnstyledButton } from "@mantine/core";
import { DatePicker } from '@mantine/dates';
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import dayjs from "../plugins/dayjs";
import { useState } from "react";

interface Props extends DefaultProps{
  dates: number[],
  onChangeDates: (dates: number[]) => void,
}

type DateRangeValue = [Date | null, Date | null];

const convertDates = (dates: DateRangeValue) => {
  if (dates[1] != null) {
    return [ 
      dayjs(dates[0]).startOf('day').valueOf(),
      dayjs(dates[1]).endOf('day').valueOf(),
    ]
  } else {
    return [ 
      dayjs(dates[0]).startOf('day').valueOf(),
      dayjs(dates[0]).endOf('day').valueOf(),
    ]
  }
}

export default function HistoryDateRange({
  dates: stringDates,
  onChangeDates,
}: Props) {
  const dayjsDates = stringDates.map((d) => dayjs(d));
  const dates = dayjsDates.map(d => d.toDate()) as DateRangeValue;

  const [ innerDates, setInnerDates ] = useState<DateRangeValue>(dates);
  const formatDates = dayjsDates?.map(date => date.format('YYYY/MM/DD'));
  const showDate = (dayjsDates[1].diff(dayjsDates[0], 'day', true) >= 1) 
    ? `${formatDates[0]} ～ ${formatDates[1]}` : `${formatDates[0]}`;

  const nextDate = (isAhead: boolean) => {
    const range = dayjsDates[1].diff(dayjsDates[0], 'day', false) + 1;
    if (isAhead) return dayjsDates.map(date => date.add(range, 'day').toDate()) as DateRangeValue;
    else return dayjsDates.map(date => date.subtract(range, 'day').toDate()) as DateRangeValue;
  }

  const setDates = (dates: DateRangeValue) => {
    setInnerDates(dates);
    onChangeDates(convertDates(dates));
  }

  return (
    <>
      <ActionIcon >
        <IconChevronLeft 
          // @ts-ignore
          onClick={() => setDates(nextDate(false)) }
        />
      </ActionIcon>
      <Popover>
        <Popover.Target>
        <UnstyledButton>
          { showDate }
        </UnstyledButton>
        </Popover.Target>
        <Popover.Dropdown>
          <DatePicker 
            type="range" 
            allowSingleDateInRange
            // @ts-ignore
            value={innerDates}
            onChange={setDates} 
          />
        </Popover.Dropdown>
      </Popover>
      <ActionIcon>
        <IconChevronRight 
          // @ts-ignore
          onClick={() => setDates(nextDate(true))}
        />
      </ActionIcon>
    </>
  )
}