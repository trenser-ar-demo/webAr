// Default stream and parsers for Uint8TypedArray data type

const buildStream = uint8Data => ({
  data: uint8Data,
  pos: 0
})

const readByte = () => stream => {
  return stream.data[stream.pos++]
}

const peekByte = (offset = 0) => stream => {
  return stream.data[stream.pos + offset]
}

const readBytes = length => stream => {
  return stream.data.subarray(stream.pos, (stream.pos += length))
}

const peekBytes = length => stream => {
  return stream.data.subarray(stream.pos, stream.pos + length)
}

const readString = length => stream => {
  return Array.from(readBytes(length)(stream))
    .map(value => String.fromCharCode(value))
    .join('')
}

const readUnsigned = littleEndian => stream => {
  const bytes = readBytes(2)(stream)
  return littleEndian ? (bytes[1] << 8) + bytes[0] : (bytes[0] << 8) + bytes[1]
}

const readArray = (byteSize, totalOrFunc) => (
  stream,
  result,
  parent
) => {
  const total =
    typeof totalOrFunc === 'function'
      ? totalOrFunc(stream, result, parent)
      : totalOrFunc

  const parser = readBytes(byteSize)
  const arr = new Array(total)
  for (var i = 0; i < total; i++) {
    arr[i] = parser(stream)
  }
  return arr
}

subBitsTotal = (bits, startIndex, length) => {
  var result = 0
  for (var i = 0; i < length; i++) {
    result += bits[startIndex + i] && 2 ** (length - i - 1)
  }
  return result
}

const readBits = schema => stream => {
  const byte = readByte()(stream)
  // convert the byte to bit array
  const bits = new Array(8)
  for (var i = 0; i < 8; i++) {
    bits[7 - i] = !!(byte & (1 << i))
  }
  // convert the bit array to values based on the schema
  return Object.keys(schema).reduce((res, key) => {
    const def = schema[key]
    if (def.length) {
      res[key] = subBitsTotal(bits, def.index, def.length)
    } else {
      res[key] = bits[def.index]
    }
    return res
  }, {})
}
