function Settings(props) {
  return (
    <Page>
        <TextInput
          label="Duration (seconds)"
          settingsKey="seconds"
        />
    </Page>
  );
}

registerSettingsPage(Settings);
