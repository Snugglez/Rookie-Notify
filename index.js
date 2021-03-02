module.exports = function reee(d) {
  let partyList, tempList = {}, tempAbnormal = {}
  d.game.initialize("party");
  d.game.party.on('list', (members) => { partyList = members; })

  d.command.add('rn', (arg) => {
    if (!arg) {
      d.settings.enabled = !d.settings.enabled
      d.command.message(`${d.settings.enabled ? 'en' : 'dis'}abled`)
    }
    if (arg) {
      d.settings.effectId = parseInt(arg)
      d.command.message(`effectId set to: ${d.settings.effectId}`)
    }
  })

  d.hook('S_LOAD_TOPO', 'event', () => { if (!d.game.party.inParty()) { tempList = {} } })

  d.hook('S_ABNORMALITY_BEGIN', '*', (e) => {
    if ([4650, 4651, 4950, 4951, 4952, 4954].includes(e.id) && !tempList[e.target]) {
      tempList[e.target] = true
      d.command.message(`${d.game.party.getMemberData(e.target).name} is a rookie`)
      addAbnormal(e.target)
    }
  })

  d.hook('S_PARTY_MEMBER_ABNORMAL_ADD', '*', (e) => {
    if ([4650, 4651, 4950, 4951, 4952, 4954].includes(e.id)) {
      partyList.forEach(members => {
        if (members.playerId == e.playerId && !tempList[members.gameId]) {
          tempList[members.gameId] = true
          d.command.message(`${members.name} is a rookie`)
          addAbnormal(members.gameId)
        }
      })
    }
  })

  d.hook('S_SPAWN_USER', '*', (e) => { if (tempList[e.gameId]) process.nextTick(() => { addAbnormal(e.gameId) }) })

  d.hook('S_ABNORMALITY_END', '*', (e) => { if (tempList[e.target] && e.id == 90520) return false })

  function addAbnormal(target) { d.send('S_PLAY_EFFECT', 1, { gameId: target, id: d.settings.effectId }) }

}
