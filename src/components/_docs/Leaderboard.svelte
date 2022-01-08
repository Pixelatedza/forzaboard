<script>
  import Leaderboard from 'components/Leaderboard.svelte'

  let records = [
    {
      "user": {
        "uuid": "8fd1a9d2-420a-4fb2-b038-394d9b8e757a",
        "username": "other-user"
      },
      "car": "Test car",
      "uuid": "aa0ab9f6-7bc8-4a18-a54e-66472d25e8c8",
      "value": 2324,
      "share_code": null,
      "pi": null,
      "video": null,
      "platform": null,
      "created": "2022-01-08T16:33:49.025210Z",
      "event": "b074c2a5-9b10-4900-94a1-9b254152fac6"
    },
    {
      "user": {
        "uuid": "5b1e950a-7235-4f44-972a-a7d345c2f720",
        "username": "admin"
      },
      "car": "Test car",
      "uuid": "671464ea-be8a-4544-ad1c-3dfcddc60e80",
      "value": 1312312,
      "share_code": null,
      "pi": null,
      "video": null,
      "platform": null,
      "created": "2022-01-08T17:18:34.702108Z",
      "event": "ca6de71b-ec18-4058-b018-c1e6ecea6f14"
    }
  ];
</script>

<style>
  div {
      display: flex;
      max-height: 100vh;
      overflow: hidden;
  }
</style>

<div>
  <Leaderboard
    bind:records={records}
    location={{
        "kind": 'danger_sign',
        "uuid": "b290bc54-ab99-4980-9509-c34b72713359",
        "name": "Bahía De Plano Circuit",
        "x": 516,
        "y": 458,
        "seasonal": false,
        "active": true
    }}
    event={{
      "uuid": "ad688fa1-ed02-41ad-9b2d-e886da9607aa",
      "name": "BAHÍA DE PLANO CIRCUIT",
      "active": true,
      "open": true,
      "description": null,
      "series": null,
      "season": null,
      "performance_class": null,
      "location": "b290bc54-ab99-4980-9509-c34b72713359"
    }}
  />
</div>
