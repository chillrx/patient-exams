window.Exams = {}

$(document).on('turbolinks:load', function () {
  if ($("[data-exams]").length > 0) {
    Exams.app = new Exams.App()
    Exams.app.start()
  } else {
    var scene, camera, renderer, controls, points
    var exam_data = $("#exam-row").data()

    init()
    animate()

    function drawLine(config) {
      points = []
      var material = new THREE.LineBasicMaterial({ color: config.color || "green", linewidth: 5 })

      points.push(new THREE.Vector3(config.x1, config.y1, 0))
      points.push(new THREE.Vector3(config.x2, config.y2, 0))

      var geometry = new THREE.BufferGeometry().setFromPoints(points)

      var line = new THREE.Line(geometry, material)

      scene.add(line)
    }

    function init() {
      scene = new THREE.Scene()

      camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 1000)
      camera.position.set(1200, 800, 600)
      camera.lookAt(scene.position)

      // N - A
      drawLine({ x1: exam_data.point_n_x, y1: exam_data.point_n_y, x2: exam_data.point_a_x, y2: exam_data.point_a_y, color: 'blue' })

      var m1 = Math.abs((points[1].y - points[0].y) / (points[1].x - points[0].x))
      var n1 = points[0].y - (m1 * points[0].x)

      // PO - OR
      drawLine({ x1: exam_data.point_po_x, y1: exam_data.point_po_y, x2: exam_data.point_or_x, y2: exam_data.point_or_y, color: 'red' })

      var m2 = Math.abs((points[1].y - points[0].y) / (points[1].x - points[0].x))
      var n2 = points[0].y - (m2 * points[0].x)

      var px = (n1 - n2) / (m2 - m1)
      var py = (m1 * px) + n1

      // PO - P
      drawLine({ x1: exam_data.point_po_x, y1: exam_data.point_po_y, x2: px, y2: py, color: 'yellow' })

      // PO - OR
      drawLine({ x1: exam_data.point_po_x, y1: exam_data.point_po_y, x2: px, y2: py, color: 'yellow' })

      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth * 0.4, window.innerHeight * 0.4)

      var container = document.getElementById('container')
      container.appendChild(renderer.domElement)

      function createControls(camera) {

        controls = new THREE.TrackballControls(camera, renderer.domElement)

        controls.rotateSpeed = 1.0
        controls.zoom = 1
        controls.panSpeed = 1

        controls.keys = [65, 83, 68]

      }

      window.addEventListener('resize', onWindowResize, false)

      createControls(camera)
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()

      renderer.setSize(window.innerWidth * 0.4, window.innerHeight * 0.4)

      controls.handleResize()
    }

    function animate() {

      requestAnimationFrame(animate)

      controls.update()

      render()

    }

    function render() {
      renderer.render(scene, camera)
    }

  }

})