import { Button, DefaultProps, Group, Modal } from "@mantine/core"
import { useState } from "react"
import FilteringWorkbook from "./FilteringWorkbook"
import FilteringLevel from "./FilteringLevel"
import { useInput, useIsMobile } from "../hooks"
import FilteringWord from "./FilteringWord"
import { IconFilter, IconSearch } from "@tabler/icons-react"
import { KeywordOption } from "../types"

interface FilteringModalProps extends DefaultProps {
  apply: (
    workbooks?: string[],
    levels?: string[],
    keyword?: string,
    keywordOption?: KeywordOption
  ) => void,
  opened: boolean,
  onOpen: () => void,
  onClose: () => void,
}

export default function FilteringModal({
  apply,
  opened,
  onOpen,
  onClose,
  ...others
}: FilteringModalProps) {
  const [ workbooks, setWorkbooks ] = useState<string[]>([])
  const [ levels, setLevels ] = useState<string[]>([])
  const [ keywordProps ] = useInput('')
  const [ keywordOption, setkeywordOption ] = useState<KeywordOption>('1')
  const isMobile = useIsMobile()

  const filtering = async () => {
    apply(workbooks, levels, keywordProps.value, keywordOption)
    onClose()
  }

  return (
    <>
      <Modal 
        opened={opened} 
        onClose={onClose} 
        title="Filtering Quiz"
        size="lg"
        fullScreen={isMobile}
      >
        <FilteringWorkbook
          value={workbooks} 
          onChange={setWorkbooks}
        />
        <FilteringLevel 
          value={levels}
          onChange={setLevels}
          mt="lg"
        />
        <FilteringWord 
          wordInputProps={keywordProps} 
          wordSearchOption={{ 
            value: keywordOption, 
            onChange: setkeywordOption 
          }}
          mt="lg"
        />
        <Group mt="xl" position="right">
          <Button 
            leftIcon={<IconSearch/>}
            onClick={filtering}
          >Search</Button>
        </Group>
      </Modal>
      <Button 
        onClick={onOpen}
        leftIcon={<IconFilter/>}
        variant="outline"
        color="orange"
        { ...others }
      >Filtering</Button>
    </>
  )
}