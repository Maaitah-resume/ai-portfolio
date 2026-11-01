import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

// A friendly 3D robot whose head and eyes follow the pointer.
// Hovering over it makes it smile and wave.

const SHELL = '#f4f5f8'
const GRAPHITE = '#1f2433'
const INDIGO = '#6366f1'

function webglAvailable() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

function shadowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')!
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  r.addColorStop(0, 'rgba(17,24,39,.35)')
  r.addColorStop(1, 'rgba(17,24,39,0)')
  g.fillStyle = r
  g.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(c)
}

export default function RobotHero({ rtl = false }: { rtl?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  // The page's reading direction decides which side the robot stands on.
  const rtlRef = useRef(rtl)
  const relayout = useRef<() => void>(() => {})
  useEffect(() => {
    rtlRef.current = rtl
    relayout.current()
  }, [rtl])

  useEffect(() => {
    // Without WebGL the hero keeps its text and plain background.
    if (!webglAvailable()) return
    const host = ref.current!
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50)
    camera.position.set(0, 0.3, 10)

    scene.add(new THREE.HemisphereLight('#ffffff', '#c7c9d6', 1.6))
    const key = new THREE.DirectionalLight('#ffffff', 2.2)
    key.position.set(3, 5, 6)
    scene.add(key)
    const rim = new THREE.DirectionalLight(INDIGO, 1.6)
    rim.position.set(-4, 2, -4)
    scene.add(rim)

    const shell = new THREE.MeshStandardMaterial({ color: SHELL, roughness: 0.32, metalness: 0.05 })
    const dark = new THREE.MeshStandardMaterial({ color: GRAPHITE, roughness: 0.25, metalness: 0.3 })
    const glow = new THREE.MeshStandardMaterial({ color: INDIGO, emissive: INDIGO, emissiveIntensity: 1.6 })
    const mid = new THREE.MeshStandardMaterial({ color: '#c9ccd8', roughness: 0.4, metalness: 0.2 })

    // Hierarchy: robot (floats) > torso (turns a little) > head pivot (looks at the pointer)
    const robot = new THREE.Group()
    scene.add(robot)
    const body = new THREE.Group()
    robot.add(body)

    const torso = new THREE.Mesh(new RoundedBoxGeometry(1.5, 1.3, 1, 6, 0.36), shell)
    torso.position.y = -0.45
    body.add(torso)
    const chest = new THREE.Mesh(new RoundedBoxGeometry(0.7, 0.42, 0.08, 4, 0.1), dark)
    chest.position.set(0, -0.3, 0.5)
    body.add(chest)
    const chestLights = [-0.18, 0, 0.18].map((x) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 12), glow.clone())
      m.position.set(x, -0.3, 0.55)
      body.add(m)
      return m
    })

    // arms hang from shoulder pivots so they can swing and wave
    const arm = (side: 1 | -1) => {
      const pivot = new THREE.Group()
      pivot.position.set(side * 0.8, -0.05, 0)
      const joint = new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 16), dark)
      pivot.add(joint)
      const limb = new THREE.Mesh(new THREE.CapsuleGeometry(0.15, 0.62, 8, 16), shell)
      limb.position.y = -0.5
      pivot.add(limb)
      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.17, 24, 16), mid)
      hand.position.y = -0.95
      pivot.add(hand)
      pivot.rotation.z = side * 0.12
      body.add(pivot)
      return pivot
    }
    const leftArm = arm(-1)
    const rightArm = arm(1)

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.26, 0.3, 24), dark)
    neck.position.y = 0.32
    body.add(neck)

    const head = new THREE.Group()
    head.position.y = 0.45
    body.add(head)
    const skull = new THREE.Mesh(new RoundedBoxGeometry(1.7, 1.3, 1.35, 6, 0.4), shell)
    skull.position.y = 0.62
    head.add(skull)
    const visor = new THREE.Mesh(new RoundedBoxGeometry(1.36, 0.78, 0.12, 5, 0.2), dark)
    visor.position.set(0, 0.64, 0.64)
    head.add(visor)
    for (const side of [-1, 1]) {
      const ear = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.14, 24), mid)
      ear.rotation.z = Math.PI / 2
      ear.position.set(side * 0.9, 0.62, 0)
      head.add(ear)
    }
    const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.42, 12), dark)
    stalk.position.y = 1.45
    head.add(stalk)
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.11, 24, 16), glow.clone())
    bulb.position.y = 1.7
    head.add(bulb)

    // eyes sit in a group that slides across the visor toward the pointer
    const eyes = new THREE.Group()
    eyes.position.set(0, 0.66, 0.71)
    head.add(eyes)
    const eyeMeshes = [-0.3, 0.3].map((x) => {
      const e = new THREE.Mesh(new THREE.SphereGeometry(0.12, 24, 16), glow)
      e.scale.set(1, 1.3, 0.35)
      e.position.x = x
      eyes.add(e)
      return e
    })
    const smile = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.028, 8, 32, Math.PI), glow)
    smile.rotation.z = Math.PI
    smile.position.set(0, 0.46, 0.71)
    smile.scale.setScalar(0.01)
    head.add(smile)

    const shadowTex = shadowTexture()
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(2.4, 0.9),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }),
    )
    shadow.rotation.x = -Math.PI / 2
    shadow.position.y = -1.75
    robot.add(shadow)

    let targetX = 0
    const resize = () => {
      const w = host.clientWidth
      const h = host.clientHeight
      renderer.setSize(w, h)
      camera.aspect = w / h
      // Beside the headline on wide screens (on its far side in right-to-left pages); below it on phones.
      const wide = w > 900
      targetX = wide ? 2.6 * (rtlRef.current ? -1 : 1) : 0
      // on narrow screens the canvas is a short strip of its own, so the robot sits centred in it
      robot.position.y = wide ? -0.2 : -0.05
      robot.scale.setScalar(wide ? 1 : 1.08)
      camera.updateProjectionMatrix()
    }

    // where the pointer is, in the robot's world, on a plane just in front of it
    const ndc = new THREE.Vector2(0, 0)
    const target = new THREE.Vector3(0, 0, 4)
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -4)
    const ray = new THREE.Raycaster()
    let hover = false
    const pickables = [skull, visor, torso, chest, leftArm, rightArm]
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect()
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
      ray.setFromCamera(ndc, camera)
      ray.ray.intersectPlane(plane, target)
      hover = ray.intersectObjects(pickables, true).length > 0
      if (reduce) frame(0, 1)
    }

    const headPos = new THREE.Vector3()
    let wave = 0
    let hasWaved = false // it waves hello on the first hover only, then just smiles
    let joy = 0
    let blinkAt = 2
    const frame = (time: number, ease: number) => {
      head.getWorldPosition(headPos)
      headPos.y += 0.6 * robot.scale.y
      const dx = target.x - headPos.x
      const dy = target.y - headPos.y
      const dz = Math.max(0.5, target.z - headPos.z)
      const yaw = THREE.MathUtils.clamp(Math.atan2(dx, dz), -0.75, 0.75)
      const pitch = THREE.MathUtils.clamp(Math.atan2(dy, dz), -0.4, 0.45)

      head.rotation.y += (yaw * 0.85 - head.rotation.y) * ease
      head.rotation.x += (-pitch * 0.85 - head.rotation.x) * ease
      body.rotation.y += (yaw * 0.25 - body.rotation.y) * ease * 0.6
      eyes.position.x += (yaw * 0.16 - eyes.position.x) * ease * 1.4
      eyes.position.y += (0.66 + pitch * 0.12 - eyes.position.y) * ease * 1.4

      // hover: smile, glow brighter and wave
      joy += ((hover ? 1 : 0) - joy) * ease
      smile.scale.setScalar(0.01 + joy)
      if (!hover && wave > 0.6) hasWaved = true
      wave += ((hover && !hasWaved ? 1 : 0) - wave) * ease * 0.8
      rightArm.rotation.z = 0.12 + wave * (2.5 + Math.sin(time * 9) * 0.35)
      rightArm.rotation.x = -wave * 0.3
      ;(glow as THREE.MeshStandardMaterial).emissiveIntensity = 1.6 + joy * 1.2

      // glide across when the page switches reading direction
      robot.position.x += (targetX - robot.position.x) * Math.min(1, ease * 0.9)

      // idle life: float, blink, chest lights and antenna pulse
      robot.position.y += (Math.sin(time * 1.6) * 0.06 - (robot.position.y - baseY())) * 0.1
      leftArm.rotation.z = -0.12 - Math.sin(time * 1.6) * 0.04
      shadow.scale.setScalar(1 - Math.sin(time * 1.6) * 0.06)
      const blinking = time > blinkAt && time < blinkAt + 0.14
      if (time > blinkAt + 0.14) blinkAt = time + 2.5 + Math.random() * 3
      eyeMeshes.forEach((e) => (e.scale.y = blinking ? 0.12 : 1.3 - joy * 0.75))
      chestLights.forEach((m, i) => {
        ;(m.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.6 + Math.max(0, Math.sin(time * 3 - i * 0.8)) * 2
      })
      ;(bulb.material as THREE.MeshStandardMaterial).emissiveIntensity = 1 + Math.max(0, Math.sin(time * 2)) * 2.2

      renderer.render(scene, camera)
    }
    const baseY = () => (host.clientWidth > 900 ? -0.2 : -0.05)

    let visible = true
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(host)

    let raf = 0
    const start = performance.now()
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      if (visible) frame((now - start) / 1000, 0.08)
    }

    resize()
    robot.position.x = targetX
    if (reduce) frame(0, 1)
    else raf = requestAnimationFrame(loop)

    const onResize = () => {
      resize()
      if (reduce) frame(0, 1)
    }
    window.addEventListener('resize', onResize)
    relayout.current = onResize
    window.addEventListener('pointermove', onMove)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      relayout.current = () => {}
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onMove)
      scene.traverse((o) => {
        const m = o as THREE.Mesh
        m.geometry?.dispose()
        ;(m.material as THREE.Material | undefined)?.dispose()
      })
      shadowTex.dispose()
      renderer.dispose()
      host.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={ref} className="neural" aria-hidden="true" />
}
