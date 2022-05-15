function Settings(props) {
  return (
    <Page>
      <!-- TODO: Add support for minutes -->
<!--         <TextInput
          label="Duration (minutes)"
          settingsKey="minutes"
        /> -->
      
        <TextInput
          label="Duration (seconds)"
          settingsKey="seconds"
        />
    </Page>
  );
}

registerSettingsPage(Settings);