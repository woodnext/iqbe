import { ActionIcon, Button, Center, DefaultProps, Modal, Space, Stack, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlayerPauseFilled } from "@tabler/icons-react";
import { useIsMobile } from "@/contexts/isMobile";

interface Props extends DefaultProps {
  onJudge: (judgement: number) => void,
}

export default function PracticePauseModal({
  onJudge,
}: Props) {
  const [ opened, { open, close } ] = useDisclosure(false);
  const isMobile = useIsMobile();
  const judge = (judgement: number) => {
    onJudge(judgement);
    close();
  }

  const defaultButton = (
    <Button
      variant="outline"
      onClick={open}
      leftIcon={<IconPlayerPauseFilled/>}
      color="dark"
    >
      Pause
    </Button>
  );

  const mobileButton = (
    <ActionIcon
      onClick={open}
      size="lg" 
      radius="xl" 
      variant="outline"
      color="dark"
    >
      <IconPlayerPauseFilled/>
    </ActionIcon>
  )

  return (
    <>
      <Modal 
        opened={opened} 
        onClose={() => close()}
        size={ isMobile ? 'xs' : 'md' }
        pos="absolute"
        left="-5%"
      >
        <Center>
          <Title>Pause</Title>
        </Center>
        <Space h={10}/>
        <Stack spacing="md" h={300} sx={(theme) => ({ backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] })}>
          <Button size="lg" color="red" onClick={() => judge(1)}>正解にしてやめる</Button>
          <Button size="lg" color="gray" onClick={() => judge(2)}>スルーにしてやめる</Button>
          <Button size="lg" color="blue" onClick={() => judge(0)}>誤答にしてやめる</Button>
          <Button size="lg" variant="outline" color="gray" onClick={close}>クイズに戻る</Button>
        </Stack>
      </Modal>
      { isMobile ? mobileButton : defaultButton }
    </>
  )
}