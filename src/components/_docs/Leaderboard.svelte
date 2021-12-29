<script>
  import Leaderboard from 'components/Leaderboard.svelte'

  let records = Array(100).fill(
    {
      "user": "ForzaboardUser1",
      "car": "Test car",
      "uuid": "912fdad6-65fb-48c0-a3d2-f51658cdd387",
      "value": 32323,
      "share_code": null,
      "pi": 349,
      "video": null,
      "platform": null,
      "created": "2021-12-27T19:10:41.337301Z",
      "event": "ad688fa1-ed02-41ad-9b2d-e886da9607aa"
    }
  );
</script>

<style>
  div {
      max-height: 100vh;
      overflow: hidden;
  }
</style>

<div>
  <Leaderboard
    records={records}
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
